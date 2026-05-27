'use client'

import React, { useCallback, useState } from 'react'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
    disabled?: boolean
    bucket?: string
    maxFiles?: number
}

export default function ImageUpload({ value = [], onChange, disabled, bucket = 'gallery-images', maxFiles = 3 }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        if (value.length + files.length > maxFiles) {
            setError(`Maksimal ${maxFiles} gambar yang diperbolehkan.`)
            return
        }

        setIsUploading(true)
        setError(null)

        const newUrls: string[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]

                if (!file.type.startsWith('image/')) {
                    throw new Error('File harus berupa gambar')
                }

                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    throw new Error('Ukuran file maksimal 2MB')
                }

                const formData = new FormData()
                formData.append('file', file)

                const uploadPath = bucket === 'profile-images' ? 'profile' : 'gallery'
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/${uploadPath}`, {
                    method: 'POST',
                    body: formData
                })
                
                const json = await res.json()
                if (!res.ok) {
                    throw new Error(json.error?.message || 'Gagal mengupload gambar')
                }

                newUrls.push(json.data.url)
            }

            onChange([...value, ...newUrls])
        } catch (err: unknown) {
            console.error('Upload failed:', err)
            const message = err instanceof Error ? err.message : 'Gagal mengupload gambar'
            setError(message)
        } finally {
            setIsUploading(false)
            e.target.value = ''
        }
    }, [value, maxFiles, bucket, onChange])

    const onRemove = useCallback(async (urlToRemove: string) => {
        // Optimistically update UI
        const newUrls = value.filter(url => url !== urlToRemove)
        onChange(newUrls)

        try {
            // Extract file path from URL
            // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filename]
            const pathParts = urlToRemove.split(`${bucket}/`)
            if (pathParts.length < 2) return

            const filePath = pathParts[1]
            const uploadPath = bucket === 'profile-images' ? 'profile' : 'gallery'

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/${uploadPath}?path=${encodeURIComponent(filePath)}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                const json = await res.json()
                console.error('Error removing file from storage:', json.error?.message || 'Gagal menghapus file')
            }
        } catch (err) {
            console.error('Error deleting file:', err)
        }
    }, [value, onChange, bucket])

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {value.map((url, index) => {
                    const isValid = url.startsWith('/') || url.startsWith('http')
                    return (
                        <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border-color)] group">
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => onRemove(url)}
                                    disabled={disabled}
                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {isValid ? (
                                <Image
                                    src={url}
                                    alt={`Uploaded image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-[var(--background)]">
                                    <ImageIcon className="w-8 h-8 text-[var(--text-secondary)]" />
                                </div>
                            )}
                        </div>
                    )
                })}

                {value.length < maxFiles && (
                    <label className={`
                        relative aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer
                        bg-[var(--background)] hover:bg-[var(--foreground)] transition-colors
                        ${error ? 'border-red-500' : 'border-[var(--border-color)]'}
                        ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 mb-2 text-[var(--accent-olive)] animate-spin" />
                            ) : (
                                <Upload className="w-8 h-8 mb-2 text-[var(--text-secondary)]" />
                            )}
                            <p className="text-xs text-[var(--text-secondary)]">
                                {isUploading ? 'Uploading...' : 'Upload Gambar'}
                            </p>
                            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                                {value.length}/{maxFiles}
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={onUpload}
                            disabled={disabled || isUploading}
                        />
                    </label>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                    <X className="w-4 h-4" /> {error}
                </p>
            )}

            <p className="text-xs text-[var(--text-secondary)]">
                Format: JPG, PNG, WEBP. Maks 2MB per file. Maksimal {maxFiles} gambar.
            </p>
        </div>
    )
}

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "./Pagination"

interface Props {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export default function PaginationWrapper({ currentPage, totalPages, onPageChange }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`/news?${params.toString()}`)
  }

  return <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
}

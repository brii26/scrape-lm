"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "./Pagination"

interface Props {
  currentPage: number
}

export default function PaginationWrapper({ currentPage }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`/news?${params.toString()}`)
  }

  return <Pagination page={currentPage} onPageChange={handlePageChange} />
}

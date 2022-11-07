package com.mnijdam.kafkatriage.record

import org.springframework.data.domain.Page

data class PageResponse<T>(
    val content: List<T>,
    val totalPages: Int,
    val totalElements: Long,
    val size: Int,
    val page: Int,
    val first: Boolean,
    val last: Boolean
) {
    companion object {
        fun <T : Any?> fromPage(page: Page<T>): PageResponse<T> {
            return PageResponse(
                page.content,
                page.totalPages,
                page.totalElements,
                page.size,
                page.number,
                page.isFirst,
                page.isLast
            )
        }
    }
}

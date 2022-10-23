export class ErrorRecord {
    id!: number
    topic!: string
    partition!: number
    timestamp!: number
    key?: string
    value?: string
    offset!: number
    triaged!: boolean
    replayedOffset?: number
}

export type DealStatus =
  | 'prospect'
  | 'qualifié'
  | 'négociation'
  | 'gagné - en cours'
  | 'perdu'

export type Priority = 'low' | 'medium' | 'high'

export interface CRMRow {
  taskName: string
  status: DealStatus
  dateCreated: string
  dueDate: string
  startDate: string
  assignees: string
  priority: Priority
  tags: string[]
  taskContent: string
  montantDeal: number
}

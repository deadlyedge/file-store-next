export type FileInfoProps = {
  filename: string
  id: string
  size: number
  deltaTime: number
  baseUrl: string
  collectionName: string
  selected?: boolean
}

export type DBInfoProps = {
  dbName: string
  dbSize: string
  filesCount: number
  chunksCount: number
}

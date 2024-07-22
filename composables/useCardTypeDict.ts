const defaultValue: Record<string, string> = {
  DC: '借记卡',
  CC: '贷记卡',
}

export function useCardTypeDict() {
  return reactive(defaultValue)
}

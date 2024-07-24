import { isNil, isNotNil } from 'es-toolkit'
import { H3Event } from 'h3'
import { cache } from '~/utils'

export interface CardInfoResp {
  /**
   * 卡类型（DC 借记卡, CC 贷记卡）
   */
  cardType: string

  /**
   * 行代码
   */
  bank: string

  /**
   * 卡号
   */
  key: string

  /**
   * 错误信息
   */
  messages: {
    errorCodes: string
    name: string
  }[]

  /**
   * 是否验证通过
   */
  validated: boolean
  stat: string
}

export default defineEventHandler(async function (
  event: H3Event
): Promise<CardInfoResp> {
  const { cardNo } = getQuery(event)
  const cacheKey = `bank-card:${cardNo}`
  let data = cache.get<CardInfoResp>(cacheKey)
  if (isNil(data)) {
    data = await $fetch('/validateAndCacheCardInfo.json', {
      method: 'GET',
      baseURL: 'https://ccdcapi.alipay.com',
      params: {
        _input_charset: 'utf-8',
        cardBinCheck: true,
        cardNo,
      },
    })
    if (isNotNil(cardNo) && data?.validated) {
      cache.set(cacheKey, data)
    }
  }
  setHeaders(event, {
    'content-type': 'application/json',
    'cache-control': 'public, s-maxage=1800, stale-while-revalidate=2400',
  })
  return data as CardInfoResp
})

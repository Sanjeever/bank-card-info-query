<script setup lang="ts">
import { NForm, useMessage } from 'naive-ui'
import qs from 'qs'

const message = useMessage()
const bankDict = useBankDict()
const cardTypeDict = useCardTypeDict()
const formRef = ref<InstanceType<typeof NForm> | null>()
const form = reactive({
  cardNo: '',
})
const data = reactive({
  cardType: '',
  bank: '',
  key: '',
})
const success = ref(false)
const src = computed(() => {
  const query = {
    d: 'cashier',
    t: data.bank,
  }
  return `https://apimg.alipay.com/combo.png?${qs.stringify(query)}`
})
const rules = {
  cardNo: {
    required: true,
    message: '请输入银行卡号',
    trigger: 'blur',
  },
}

async function fetchData() {
  const resp = await $fetch('/api/alipay/card-info', {
    method: 'GET',
    query: {
      ...form,
    },
  })
  if (resp.messages.length === 0) {
    data.cardType = resp.cardType
    data.bank = resp.bank
    data.key = resp.key
    success.value = true
  } else {
    success.value = false
    const errorMsg = resp.messages.map(message => message.errorCodes).join(',')
    message.error(errorMsg)
  }
}

function handleClickQuery() {
  success.value = false
  formRef.value?.validate(errors => {
    if (!errors) {
      data.cardType = ''
      data.bank = ''
      data.key = ''
      fetchData()
    }
  })
}
</script>

<template>
  <div>
    <n-form
      ref="formRef"
      inline
      :label-width="80"
      :model="form"
      :rules="rules"
      size="large">
      <n-form-item label="银行卡号" path="cardNo">
        <n-input
          v-model:value="form.cardNo"
          placeholder="请输入银行卡号"
          :allow-input="(value: string) => !value || /^\d+$/.test(value)"
          show-count
          clearable />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click.prevent="handleClickQuery">
          查询
        </n-button>
      </n-form-item>
    </n-form>
    <n-descriptions
      v-if="success"
      :column="1"
      label-placement="left"
      title="查询结果">
      <n-descriptions-item label="卡类型">
        {{ cardTypeDict[data.cardType] }} {{ data.cardType }}
      </n-descriptions-item>
      <n-descriptions-item label="发卡行">
        {{ bankDict[data.bank] }} {{ data.bank }}
      </n-descriptions-item>
      <n-descriptions-item label="行图标">
        <n-image width="128px" height="36px" :src="src" />
      </n-descriptions-item>
    </n-descriptions>
  </div>
</template>

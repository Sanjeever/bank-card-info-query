<script setup lang="ts">
import { ElMessage, type FormInstance } from 'element-plus'
import qs from 'qs'

const bankDict = useBankDict()
const cardTypeDict = useCardTypeDict()
const formRef = ref<FormInstance>()
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
  cardNo: [
    {
      required: true,
      message: '请输入银行卡号',
      trigger: 'blur',
    },
  ],
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
    ElMessage.warning(errorMsg)
  }
}

async function handleClickQuery() {
  success.value = false
  await formRef.value?.validate((valid, fields) => {
    if (valid) {
      data.cardType = ''
      data.bank = ''
      data.key = ''
      fetchData()
    }
  })
}

function handleInput(value: string) {
  form.cardNo = value.replace(/[^0-9.]/g, '')
}
</script>

<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      inline
      label-position="top"
      size="large"
      label-width="auto">
      <el-form-item prop="cardNo" label="银行卡号">
        <el-input
          v-model="form.cardNo"
          @input="handleInput"
          style="width: 200px"
          placeholder="请输入银行卡号"
          size="large"
          show-word-limit
          clearable />
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="primary" @click="handleClickQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-descriptions v-if="success" title="查询结果" :column="1" size="large">
      <el-descriptions-item label="卡类型">
        {{ cardTypeDict[data.cardType] }} {{ data.cardType }}
      </el-descriptions-item>
      <el-descriptions-item label="发卡行">
        {{ bankDict[data.bank] }} {{ data.bank }}
      </el-descriptions-item>
      <el-descriptions-item label="行图标">
        <el-image
          style="width: 128px; height: 36px"
          :src="src"
          :preview-src-list="[src]" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

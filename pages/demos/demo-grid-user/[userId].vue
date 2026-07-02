<template>
    <div class="page-demo">
        <main class="page-demo-main">
            <section class="page-demo-card">
                <h1 class="page-demo-card__title">사용자 수정</h1>

                <form class="page-demo-stack" @submit.prevent="saveUser">
                    <AppInput v-model="form.USER_ID" label="아이디" readonly />
                    <AppInput v-model="form.USER_NAME" label="이름" />
                    <AppInput v-model="form.USER_POWER" label="권한" type="number" />
                    <AppInput v-model="form.USER_PHONE" label="전화번호" />

                    <div class="page-demo-actions">
                        <AppButton type="button" @click="router.back()">취소</AppButton>
                        <AppButton type="submit" tone="primary">저장</AppButton>
                    </div>
                </form>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const api = useApi()
const userId = String(route.params.userId ?? '')

const form = reactive({
    USER_ID: '',
    USER_NAME: '',
    USER_POWER: '',
    USER_PHONE: ''
})

onMounted(async () => {
    const user = await api.get<{
        USER_ID: string
        USER_NAME: string
        USER_POWER: number
        USER_PHONE: string
    }>(`/api/users/${userId}`)

    form.USER_ID = user.USER_ID
    form.USER_NAME = user.USER_NAME
    form.USER_POWER = String(user.USER_POWER)
    form.USER_PHONE = user.USER_PHONE
})

const saveUser = async () => {
    await api.put(`/api/users/${userId}`, {
        USER_ID: form.USER_ID,
        USER_NAME: form.USER_NAME,
        USER_POWER: Number(form.USER_POWER),
        USER_PHONE: form.USER_PHONE
    })

    router.push('/demos/demo-grid')
}
</script>

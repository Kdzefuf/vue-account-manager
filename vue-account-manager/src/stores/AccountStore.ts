import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Label {
    text: string
}

interface Account {
    id: string
    labels: Label[]
    accountType: 'LDAP' | 'Локальная'
    login: string
    password: string | null
    showPassword?: boolean
}

export const useAccountStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([])

    function addAccount() {
        accounts.value.push({
            id: Date.now().toString(),
            labels: [],
            accountType: 'Локальная',
            login: '',
            password: ''
        })
    }

    function updateAccount(id: string, updatedData: Partial<Account>) {
        const index = accounts.value.findIndex(acc => acc.id === id)
        if (index !== -1) {
            accounts.value[index] = { ...accounts.value[index], ...updatedData }
        }
    }

    function deleteAccount(id: string) {
        accounts.value = accounts.value.filter(acc => acc.id !== id)
    }

    function getAccount(id: string) {
        return accounts.value.find(acc => acc.id === id)
    }

    if (localStorage.getItem('accounts')) {
        accounts.value = JSON.parse(localStorage.getItem('accounts')!)
    }

    watch(accounts, (newVal) => {
        localStorage.setItem('accounts', JSON.stringify(newVal))
    }, { deep: true })

    return { accounts, addAccount, updateAccount, deleteAccount, getAccount }
})
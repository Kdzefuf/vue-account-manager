import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Label {
    text: string
}

interface Account {
    id: string
    labels: Label[]
    accountType: 'LDAP' | 'Локальная'
    login: string
    password: string | null
}

export const useAccountStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([])

    function addAccount() {
    }

    function updateAccount(id: string, updatedData: Partial<Account>) {
    }

    function deleteAccount(id: string) {
    }

    function getAccount(id: string) {
    }

    return { accounts, addAccount, updateAccount, deleteAccount, getAccount }
})
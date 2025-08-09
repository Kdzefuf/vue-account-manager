<template>
  <div class="account-management">
    <div class="top-text">
      <h1>Учетные записи</h1>
      <button @click="addAccount" class="add-btn">+</button>
    </div>

    <p class="hint-text">Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</p>

    <div class="accounts-table">
      <div class="table-header">
        <div class="cell">Метки</div>
        <div class="cell">Тип записи</div>
        <div class="cell">Логин</div>
        <div class="cell">Пароль</div>
        <div class="cell actions">Действия</div>
      </div>

      <div class="table-row" v-for="account in accounts" :key="account.id">
        <div class="cell">
          <input
            v-model="account.labelsDisplay"
            @blur="updateLabels(account)"
            placeholder="Значение"
            maxlength="50"
          />
        </div>
        <div class="cell">
          <select
            v-model="account.accountType"
            @change="updateAccountType(account)"
          >
            <option value="Локальная">Локальная</option>
            <option value="LDAP">LDAP</option>
          </select>
        </div>
        <div class="cell" :class="{ 'wide-cell': account.accountType === 'LDAP' }">
          <input
            v-model="account.login"
            @blur="validateLogin(account)"
            :class="{ 'invalid': account.loginError }"
            required
            maxlength="100"
          />
        </div>
        
        <div class="cell" v-if="account.accountType === 'Локальная'">
          <div class="password-field">
            <input
              v-model="account.password"
              @blur="validatePassword(account)"
              :class="{ 'invalid': account.passwordError }"
              :type="'password'"
              required
              maxlength="100"
            />
          </div>
        </div>
        
        <div class="cell actions">
          <button @click="deleteAccount(account.id)" class="delete-btn">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAccountStore } from '../stores/AccountStore'

const accountStore = useAccountStore()

const accounts = computed(() => 
  accountStore.accounts.map(acc => ({
    ...acc,
    labelsDisplay: acc.labels.map(l => l.text).join('; '),
    loginError: false,
    passwordError: false,
    showPassword: false
  }))
)

const addAccount = () => {
}

const updateLabels = (account: any) => {
}

const updateAccountType = (account: any) => {
}

const validateLogin = (account: any) => {
}

const validatePassword = (account: any) => {
}

const deleteAccount = (id: string) => {
}
</script>
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
              :type="accountStore.getAccount(account.id)?.showPassword ? 'text' : 'password'"
              required
              maxlength="100"
            />
            <button 
              @click="togglePasswordVisibility(account.id)"
              class="toggle-password"
              type="button"
            >
              <img 
                :src="accountStore.getAccount(account.id)?.showPassword ? eyeOpen : eyeClose" 
                alt="Toggle password visibility"
                class="eye-icon"
              />
            </button>
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

import eyeOpen from '../assets/open.png'
import eyeClose from '../assets/close.png'

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

const togglePasswordVisibility = (id: string) => {
  const account = accountStore.accounts.find(acc => acc.id === id)
  if (account) {
    accountStore.updateAccount(id, {
      showPassword: !account.showPassword
    })
  }
}

const addAccount = () => {
  accountStore.addAccount()
}

const updateLabels = (account: any) => {
  const labels = account.labelsDisplay
    .split(';')
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0)
    .map((text: string) => ({ text }))
  
  accountStore.updateAccount(account.id, { labels })
}

const updateAccountType = (account: any) => {
  const update = {
    accountType: account.accountType,
    password: account.accountType === 'LDAP' ? null : account.password
  }
  accountStore.updateAccount(account.id, update)
}

const validateLogin = (account: any) => {
  account.loginError = account.login.trim() === ''
  if (!account.loginError) {
    accountStore.updateAccount(account.id, { login: account.login })
  }
}

const validatePassword = (account: any) => {
  if (account.accountType === 'Локальная') {
    account.passwordError = account.password.trim() === ''
    if (!account.passwordError) {
      accountStore.updateAccount(account.id, { password: account.password })
    }
  }
}

const deleteAccount = (id: string) => {
  accountStore.deleteAccount(id)
}
</script>

<style scoped>
.account-management {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.top-text {
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.add-btn {
  background-color: #fff;
  color: #4e4e4e;
  font-size: 2rem;
  padding: 4px 12px;
  border: 2px solid #4e4e4e;
  border-radius: 4px;
  cursor: pointer;
}

.hint-text {
  background-color: rgb(223, 246, 253);
  margin-bottom: 20px;
  padding: 2px 4px;
  border-radius: 5px;
}

.accounts-table {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.table-header, .table-row {
  display: flex;
  width: 100%;
}

.cell {
  padding: 12px;
  border-right: 1px solid #ddd;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.wide-cell {
  flex: 2;
  padding: 12px 24px;
}

.actions {
  flex: 0 0 100px;
  justify-content: center;
}

.table-header .cell {
  background-color: #f5f5f5;
  font-weight: bold;
}

.table-row {
  border-top: 1px solid #ddd;
}

.table-row:last-child {
  border-bottom: none;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.invalid {
  border-color: #ff4444;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.password-field {
  position: relative;
  display: flex;
}

.password-field input {
  padding-right: 30px;
}

.toggle-password {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.toggle-password:hover {
  color: #555;
}

@media (max-width: 768px) {
  .accounts-table {
    overflow-x: auto;
  }
  
  .table-header, .table-row {
    min-width: 700px;
  }
}
</style>
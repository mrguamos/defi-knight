import { defineStore } from 'pinia'
import { useContract } from './contract-store'
export const useRewards = defineStore('rewards', {
  state: () => {
    return {
      rewardsFee: 0,
      rewardsFeePerDay: 0,
      rewardsDuration: 0,
    }
  },
  actions: {
    async getAccountRewards(account: string) {
      const contracts = useContract()
      return contracts.rewardsManager.getAccountRewards(account)
    },
    async getRewards() {
      const contracts = useContract()
      return contracts.rewardsManager.getRewards()
    },
    async getRewardsFee() {
      const contracts = useContract()
      return contracts.rewardsManager.REWARDS_FEE()
    },
    async getRewardsDuration() {
      const contracts = useContract()
      return contracts.rewardsManager.REWARDS_DURATION()
    },
    async getRewardsFeePerDay() {
      const contracts = useContract()
      return contracts.rewardsManager.REWARDS_FEE_PER_DAY()
    },
  },
})

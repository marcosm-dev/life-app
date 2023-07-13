/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { EmailData } from 'src/components/models';
import { sendEmail } from 'src/lib';

export const useServicesStore = defineStore('services', {
  getters: {},
  actions: {
    async sendEmail(payload: EmailData) {
      await sendEmail(payload)
    }
  }
});

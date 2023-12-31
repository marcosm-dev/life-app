import emailjs from '@emailjs/browser/'
import { EmailData } from 'src/components/models'

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || ''

export const sendEmail = async (templateParams: EmailData) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    )
    return response.text
  } catch (error) {
    console.log(error)
  }
}

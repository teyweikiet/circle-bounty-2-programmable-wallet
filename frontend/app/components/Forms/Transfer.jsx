'use client'

import { useRouter } from 'next/navigation'
import { TextInput, Button, Group, Box } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { notifications } from '@mantine/notifications'

import { useCircleContext } from '@/app/hooks/circle'
import { useQueryClient } from '@tanstack/react-query'
import { IconX } from '@tabler/icons-react'

const schema = z
  .object({
    destination: z.string().min(1, { message: 'Please enter a valid destination address.' }),
    amount: z.coerce.number().gt(0)
  })

export function TransferForm ({ walletId, tokenBalance, onClose }) {
  const form = useForm({
    initialValues: {
      destination: '',
      amount: ''
    },
    validate: zodResolver(schema)
  })
  const router = useRouter()
  const { execute } = useCircleContext()
  const queryClient = useQueryClient()

  const handleTransfer = async ({ destination, amount }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/wallets/${walletId}/transfer/${destination}`, {
        method: 'POST',
        body: JSON.stringify({ amount, tokenId: tokenBalance.token.id })
      })
      const { userToken, encryptionKey, challengeId } = await res.json()

      await execute({ userToken, encryptionKey, challengeId }, (error, result) => {
        if (error) {
          notifications.show({
            color: 'red',
            title: `Error: ${error?.message ?? 'Error!'}`
          })
          return
        }
        queryClient.refetchQueries({ queryKey: ['balances'] })
        notifications.show({
          title: `Challenge: ${result?.type}`,
          message: `Status: ${result?.status}`
        })
      })

      router.refresh()
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error sending, please try again',
        message: error.message
      })
    }
  }

  return (
      <Box maw={340} mx="auto" mt="md" pos="relative">
        <IconX
          style={{
            position: 'absolute',
            top: '-25px',
            right: '-50px',
            cursor: 'pointer'
          }}
          onClick={onClose}
        />
        <form onSubmit={form.onSubmit(handleTransfer)}>
          <TextInput
            required
            label="Destination Address"
            name="destination"
            placeholder="0x6d76cf5690fa72827e4984097d137295de17d960"
            {...form.getInputProps('destination')}
          />
          <TextInput
            required
            label="Amount"
            name="amount"
            placeholder="0.1"
            {...form.getInputProps('amount')}
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
            >
              Send
            </Button>
          </Group>
        </form>
      </Box>
  )
}

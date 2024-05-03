'use client'

import { Button, Group, Box, Modal, ActionIcon, MultiSelect } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { notifications } from '@mantine/notifications'

import { IconPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCircleContext } from '@/app/hooks/circle'

const schema = z
  .object({
    blockchains: z.string().min(1, { message: 'Please select blockchains.' }).array()
  })

export function WalletForm ({ createUserPin }) {
  const form = useForm({
    initialValues: {
      blockchains: []
    },
    validate: zodResolver(schema)
  })
  const [opened, { open, close }] = useDisclosure(false)
  const { execute } = useCircleContext()
  const queryClient = useQueryClient()

  const handleCreateWallet = async ({ blockchains }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/wallets`, {
      method: 'POST',
      body: JSON.stringify({
        createUserPin,
        blockchains
      })
    })
    const { userToken, encryptionKey, challengeId } = await res.json()
    execute({ userToken, encryptionKey, challengeId }, (error, result) => {
      if (error) {
        notifications.show({
          color: 'red',
          title: `Error: ${error?.message ?? 'Error!'}`
        })
        return
      }
      notifications.show({
        title: `Challenge: ${result?.type}`,
        message: `Status: ${result?.status}`
      })
      close()
      form.reset()
      queryClient.refetchQueries({ queryKey: ['wallets'] })
    })
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close()
          form.reset()
        }}
        title="Create Wallet"
        centered
      >
        <Box maw={340} mx="auto" mt="md" pos="relative">
          <form onSubmit={form.onSubmit(handleCreateWallet)}>
            <MultiSelect
              required
              label="Blockchains"
              name="blockchains"
              placeholder="Select blockchains"
              data={[
                'ETH-SEPOLIA',
                'AVAX-FUJI',
                'MATIC-AMOY'
              ]}
              {...form.getInputProps('blockchains')}
            />
            <Group justify="flex-end" mt="md">
              <Button
                type="submit"
              >
                Save
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <ActionIcon
        color="blue"
        radius="xl"
        size={60}
        onClick={open}
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40
        }}
      >
        <IconPlus stroke={1.5} size={30} />
      </ActionIcon>
    </>
  )
}

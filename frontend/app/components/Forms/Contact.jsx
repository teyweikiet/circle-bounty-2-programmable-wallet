'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TextInput, Button, Group, Box, Modal, ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { notifications } from '@mantine/notifications'

import { IconPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'

const schema = z
  .object({
    name: z.string().min(1, { message: 'Please enter a valid name.' }),
    address: z.string().min(1, { message: 'Please enter a valid address.' })
  })

export function ContactForm () {
  const form = useForm({
    initialValues: {
      name: '',
      address: ''
    },
    validate: zodResolver(schema)
  })
  const [opened, { open, close }] = useDisclosure(false)
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()

  const handleCreateContact = async ({ name, address }) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .insert({ name, address })

      error &&
        notifications.show({
          color: 'red',
          title: 'Error saving contact, please try again',
          message: error.message
        })

      queryClient.refetchQueries({ queryKey: ['contacts'] })
      close()
      form.reset()
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error saving contact, please try again',
        message: error.message
      })
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close()
          form.reset()
        }}
        title="Save Contact"
        centered
      >
        <Box maw={340} mx="auto" mt="md" pos="relative">
          <form onSubmit={form.onSubmit(handleCreateContact)}>
            <TextInput
              required
              label="Name"
              name="name"
              placeholder="John Doe"
              {...form.getInputProps('name')}
            />
            <TextInput
              required
              label="Address"
              name="address"
              placeholder="0x6d76cf5690fa72827e4984097d137295de17d960"
              {...form.getInputProps('address')}
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

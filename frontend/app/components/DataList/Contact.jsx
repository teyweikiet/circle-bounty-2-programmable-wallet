import { List, Title, Text } from '@mantine/core'

export function ContactList ({ contacts }) {
  return (
    <List listStyleType="none">
      {
        contacts?.map((contact) => (
          <List.Item
            key={contact.id}
            py="xs"
            px="md"
            style={{
              cursor: 'pointer',
              borderBottom: '1px solid lightgrey'
            }}
          >
            <Title order={4}>{contact.name}</Title>
            <Text>{contact.address}</Text>
          </List.Item>
        ))
      }
    </List>
  )
}

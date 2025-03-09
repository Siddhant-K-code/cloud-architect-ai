import { Button, Menu, Text, Divider } from "@mantine/core";
import { parseProposals, type DiagramProposalInterface, type CloudProviderType } from "../lib/vertex";
import examples from "../lib/examples";
import { IconTemplate, IconSchool, IconDeviceGamepad2 } from "@tabler/icons-react";

function ExampleMenu({
  generateDiagramWithExample,
  cloudProvider,
}: {
  generateDiagramWithExample: (data: DiagramProposalInterface[]) => void;
  cloudProvider: CloudProviderType;
}) {
  return (
    <Menu shadow="md" width={240} position="bottom-end">
      <Menu.Target>
        <Button
          variant="outline"
          color="dark"
          leftSection={<IconTemplate size={16} />}
        >
          Templates
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Quick Start Templates</Menu.Label>
        <Menu.Item
          leftSection={<IconSchool size={16} />}
          onClick={() => {
            const proposals = parseProposals(examples.checkInSystem);
            const updatedProposals = proposals.map(proposal => ({
              ...proposal,
              title: proposal.title.replace('Google Cloud', cloudProvider),
            }));
            generateDiagramWithExample(updatedProposals);
          }}
        >
          <Text size="sm">Attendance System</Text>
          <Text size="xs" c="dimmed">School/office check-in solution</Text>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconDeviceGamepad2 size={16} />}
          onClick={() => {
            const proposals = parseProposals(examples.game);
            const updatedProposals = proposals.map(proposal => ({
              ...proposal,
              title: proposal.title.replace('Google Cloud', cloudProvider),
            }));
            generateDiagramWithExample(updatedProposals);
          }}
        >
          <Text size="sm">Game Server</Text>
          <Text size="xs" c="dimmed">Mobile game backend infrastructure</Text>
        </Menu.Item>

        <Divider />

        <Text size="xs" c="dimmed" p="xs" style={{ textAlign: 'center' }}>
          More templates coming soon!
        </Text>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ExampleMenu;

import {
  AddIcon,
  Button,
  CommentIcon,
  defaultTheme,
  EditIcon,
  EndorsedIcon,
  EyeOpenIcon,
  FilterIcon,
  IconButton,
  LightbulbIcon,
  MapMarkerIcon,
  Menu,
  MenuIcon,
  MoreIcon,
  SendToMapIcon,
  Strong,
  TrashIcon,
} from "evergreen-ui";

// Inline markup used by the help copy. Keeping the components here (rather
// than in the catalog) is what lets a translator move a button or an
// emphasised term to wherever their language needs it in the sentence.
// Each tag mimics the control it names, so the reader recognises it on screen.
const helpTags = {
  b: (chunks: React.ReactNode) => <b>{chunks}</b>,
  em: (chunks: React.ReactNode) => (
    <Strong size={500} fontStyle="italic">
      {chunks}
    </Strong>
  ),
  button: (chunks: React.ReactNode) => (
    <Button type="button" marginX={4} height={24}>
      {chunks}
    </Button>
  ),
  primaryButton: (chunks: React.ReactNode) => (
    <Button type="button" marginX={4} height={24} appearance="primary">
      {chunks}
    </Button>
  ),
  successButton: (chunks: React.ReactNode) => (
    <Button
      type="button"
      marginX={4}
      height={24}
      appearance="primary"
      intent="success"
    >
      {chunks}
    </Button>
  ),
  saveButton: (chunks: React.ReactNode) => (
    <Button type="button" marginX={4} height={24} intent="success">
      {chunks}
    </Button>
  ),
  dangerButton: (chunks: React.ReactNode) => (
    <Button
      type="button"
      marginX={4}
      height={24}
      appearance="primary"
      intent="danger"
    >
      {chunks}
    </Button>
  ),
  addButton: (chunks: React.ReactNode) => (
    <Button
      type="button"
      marginX={4}
      height={24}
      iconBefore={AddIcon}
      appearance="primary"
      intent="success"
    >
      {chunks}
    </Button>
  ),
  certifyButton: (chunks: React.ReactNode) => (
    <Button
      type="button"
      marginX={4}
      height={24}
      appearance="primary"
      intent="success"
      iconAfter={EndorsedIcon}
    >
      {chunks}
    </Button>
  ),
  menuButton: (chunks: React.ReactNode) => (
    <Button
      type="button"
      marginX={4}
      height={24}
      appearance="minimal"
      iconAfter={MenuIcon}
    >
      {chunks}
    </Button>
  ),
  shareButton: (chunks: React.ReactNode) => (
    <Button type="button" marginX={4} height={24} iconBefore={EyeOpenIcon}>
      {chunks}
    </Button>
  ),
  addIconButton: () => (
    <IconButton
      type="button"
      marginX={4}
      height={24}
      icon={AddIcon}
      appearance="primary"
      intent="success"
    />
  ),
  filterButton: () => (
    <IconButton type="button" marginX={4} height={24} icon={FilterIcon} />
  ),
  moreButton: () => (
    <IconButton
      type="button"
      marginX={4}
      height={24}
      icon={MoreIcon}
      appearance="minimal"
    />
  ),
  viewItem: (chunks: React.ReactNode) => (
    <Menu.Item background="tint1" marginLeft={8} icon={SendToMapIcon}>
      {chunks}
    </Menu.Item>
  ),
  editItem: (chunks: React.ReactNode) => (
    <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
      {chunks}
    </Menu.Item>
  ),
  certifyItem: (chunks: React.ReactNode) => (
    <Menu.Item background="tint1" marginLeft={8} icon={EndorsedIcon}>
      {chunks}
    </Menu.Item>
  ),
  deleteItem: (chunks: React.ReactNode) => (
    <Menu.Item
      background="tint1"
      marginLeft={8}
      icon={TrashIcon}
      intent="danger"
    >
      {chunks}
    </Menu.Item>
  ),
  bulb: () => (
    <LightbulbIcon
      marginX={4}
      color={defaultTheme.colors.purple600}
      verticalAlign="middle"
    />
  ),
  marker: () => <MapMarkerIcon color="info" verticalAlign="middle" />,
  trash: () => <TrashIcon marginX={4} color="danger" verticalAlign="middle" />,
  commentIcon: () => <CommentIcon verticalAlign="middle" />,
};

export default helpTags;

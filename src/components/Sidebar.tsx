import React from "react";
import { Link } from "react-router-dom";
import PublishLadder from "./PublishLadder";
import { useFeatureFlags } from "../contexts/featureFlagsContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ViewListIcon from "@mui/icons-material/ViewList";

type SidebarProps = {
	onClose: () => void;
	setVisible: (visible: boolean) => void;
	visible: boolean;
};

const drawerWidth = 240;

const navItems = [
	{ label: "Home", to: "/", icon: <HomeIcon /> },
	{
		label: "Create a New Ladder",
		to: "/create",
		icon: <AddCircleOutlineOutlinedIcon />
	},
	{ label: "View Existing Ladders", to: "/ladders", icon: <ViewListIcon /> }
];

const Sidebar = ({ onClose, setVisible, visible }: SidebarProps) => {
	const { publishLadder: publishLadderFlag } = useFeatureFlags();
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
	const sidebarBg = theme.palette.background.default;

	const drawerContent = (
		<Box sx={{ width: drawerWidth }} role="presentation">
			<Toolbar />
			<List>
				{navItems.map(item => (
					<ListItem key={item.to} disablePadding>
						<ListItemButton
							component={Link}
							to={item.to}
							onClick={!isDesktop ? onClose : undefined}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.label} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			{publishLadderFlag ? (
				<>
					<Divider sx={{ my: 1 }} />
					<Box sx={{ p: 2 }}>
						<PublishLadder />
					</Box>
				</>
			) : null}
		</Box>
	);

	return (
		<Box
			component="nav"
			sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
			aria-label="sidebar navigation"
		>
			{isDesktop ? (
				<Drawer
					variant="permanent"
					open
					sx={{
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							backgroundColor: sidebarBg,
							color: theme.palette.text.primary,
							borderRight: `1px solid ${theme.palette.divider}`
						}
					}}
				>
					{drawerContent}
				</Drawer>
			) : (
				<SwipeableDrawer
					onOpen={() => setVisible(true)}
					open={visible}
					swipeAreaWidth={drawerWidth}
					onClose={onClose}
					ModalProps={{ keepMounted: true }}
					anchor="bottom"
					disableSwipeToOpen={false}
					sx={{
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							backgroundColor: sidebarBg,
							color: theme.palette.text.primary,
							borderRight: `1px solid ${theme.palette.divider}`
						}
					}}
				>
					{drawerContent}
				</SwipeableDrawer>
			)}
		</Box>
	);
};

export default Sidebar;

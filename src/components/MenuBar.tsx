import React, { useState, useContext } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";

const MenuBar: React.FC = () => {
	const pathname = window.location.pathname;
	const path = pathname === "/" ? "home" : pathname.substr(1);
	const [activeItem, setActiveItem] = useState<string | undefined>(path);

	const { user, logout } = useContext(AuthContext);

	const handleItemClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		data: MenuItemProps
	) => setActiveItem(data.name);

	const menuBar = user ? (
		<Menu pointing secondary size="huge" color="grey">
			<Menu.Item
				name={user.username}
				icon="user secret"
				active
				as={Link}
				to="/"
			/>
			<Menu.Menu position="right">
				<Menu.Item name="logout" icon="power off" onClick={logout} />
			</Menu.Menu>
		</Menu>
	) : (
		<Menu pointing secondary size="huge" color="grey">
			<Menu.Item
				name="home"
				icon="connectdevelop"
				active={activeItem === "home"}
				onClick={handleItemClick}
				as={Link}
				to="/"
			/>
			<Menu.Menu position="right">
				<Menu.Item
					name="login"
					icon="sign-in"
					active={activeItem === "login"}
					onClick={handleItemClick}
					as={Link}
					to="/login"
				/>
				<Menu.Item
					name="register"
					icon="signup"
					active={activeItem === "register"}
					onClick={handleItemClick}
					as={Link}
					to="/register"
				/>
			</Menu.Menu>
		</Menu>
	);

	return menuBar;
};

export default MenuBar;

import React from "react";
import { Popup } from "semantic-ui-react";

interface Props {
	content: string;
}

const MyPopup: React.FC<Props> = ({ content, children }) => {
	return <Popup content={content} inverted trigger={children} />;
};

export default MyPopup;

import * as React from "react";
import {CardType} from "../../../enums";
import Entity from '../../../Entity';
import CardArt from "./CardArt";
import {EntityProps} from "../../../interfaces";
import InPlayCardArt from "./InPlayCardArt";

class WeaponArt extends React.Component<EntityProps, {}> {
	public render(): JSX.Element {
		var images = [];
		var entity = this.props.entity;

		images.push({
			image: InPlayCardArt.extractTexture(entity.getCardId(), this.props.cards),
			isArt: true,
			classes: ["hero-weapon-portrait"]
		});

		var frame = "inplay_weapon.png";
		// TODO: weapon isn't actually sheathed when exhausted, end of turn
		if (entity.isExhausted())
			frame = "inplay_weapon_dome.png";

		images.push({
			image: frame,
			classes: ["hero-weapon-frame"]
		});

		return (
			<CardArt layers={images} scale={0.6} square={true} margin={true}
				assetDirectory={this.props.assetDirectory}
				textureDirectory={this.props.textureDirectory}
				/>
		);
	}
}

export default WeaponArt;

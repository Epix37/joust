import * as React from "react";

import * as Immutable from "immutable";
import PlayerEntity from '../../Player';
import Entity from '../../Entity';
import Option from '../../Option';
import EntityList from './EntityList';
import Deck from './Deck';
import Hand from './Hand';
import Hero from './Hero';
import HeroPower from './HeroPower';
import Field from './Field';
import Weapon from './Weapon';
import Secrets from './Secrets';
import Rank from './Rank';

import {Zone, CardType, GameTag} from '../../enums'
import {OptionCallbackProps, CardDataProps, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps} from "../../interfaces";

interface PlayerProps extends OptionCallbackProps, CardDataProps, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps, React.Props<any> {
	player: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Entity>>;
	options: Immutable.Map<number, Immutable.Map<number, Option>>;
	isTop: boolean;
}

class Player extends React.Component<PlayerProps, {}> {

	public render(): JSX.Element {
		var filterByCardType = function(cardType: number) {
			return function(entity: Entity): boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		var emptyEntities = Immutable.Map<number, Entity>();
		var emptyOptions = Immutable.Map<number, Option>();

		var playEntities = this.props.entities.get(Zone.PLAY) || Immutable.Map<number, Entity>();
		var playOptions = this.props.options.get(Zone.PLAY) || Immutable.Map<number, Option>();

		/* Equipment */
		var heroEntity = playEntities.filter(filterByCardType(CardType.HERO)).first();
		var hero = <Hero entity={heroEntity}
			option={heroEntity ? playOptions.get(heroEntity.getId()) : null}
			secrets={this.props.entities.get(Zone.SECRET) || Immutable.Map<number, Entity>() }
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			textureDirectory={this.props.textureDirectory}
			controller={this.props.player}
			/>;
		var heroPowerEntity = playEntities.filter(filterByCardType(CardType.HERO_POWER)).first();
		var heroPower = <HeroPower entity={heroPowerEntity}
			option={heroPowerEntity ? playOptions.get(heroPowerEntity.getId()) : null}
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			textureDirectory={this.props.textureDirectory}
			controller={this.props.player}
			/>;
		var weapon = <Weapon entity={playEntities.filter(filterByCardType(CardType.WEAPON)).first() }
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			textureDirectory={this.props.textureDirectory}
			controller={this.props.player}
			/>;

		var field = <Field entities={playEntities.filter(filterByCardType(CardType.MINION)) || emptyEntities}
			options={playOptions || emptyOptions}
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			textureDirectory={this.props.textureDirectory}
			controller={this.props.player}
			/>;
		var deck = <Deck entities={this.props.entities.get(Zone.DECK) || emptyEntities}
			options={this.props.options.get(Zone.DECK) || emptyOptions}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			textureDirectory={this.props.textureDirectory}
			controller={this.props.player}
			/>;
		var hand = <Hand entities={this.props.entities.get(Zone.HAND) || emptyEntities}
			options={this.props.options.get(Zone.HAND) || emptyOptions}
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			cardOracle={this.props.cardOracle}
			isTop={this.props.isTop}
			assetDirectory={this.props.assetDirectory}
			textureDirectory={this.props.textureDirectory}
			controller={this.props.player}
			/>;
		var name = this.props.player.getName() ? <div className="name">{this.props.player.getName() }</div> : null;

		var rank = <Rank rank={this.props.player.getRank() }
			legendRank={this.props.player.getLegendRank() }
			assetDirectory={this.props.assetDirectory}
			textureDirectory={this.props.textureDirectory}
			/>;

		var crystals = [];
		let resources = this.props.player.getTag(GameTag.RESOURCES) + this.props.player.getTag(GameTag.TEMP_RESOURCES);
		let available = resources - this.props.player.getTag(GameTag.RESOURCES_USED);
		for (let i = 0; i < this.props.player.getTag(GameTag.MAXRESOURCES); i++) {
			var crystalClassNames = ['crystal'];
			if (i < available) {
				crystalClassNames.push('full');
			}
			else if (i < resources) {
				if (i >= resources - this.props.player.getTag(GameTag.OVERLOAD_LOCKED)) {
					crystalClassNames.push('locked');
				}
				else {
					crystalClassNames.push('empty');
				}
			}
			else {
				crystalClassNames.push('hidden');
			}
			crystals.push(<img src={this.props.assetDirectory + 'images/mana_crystal.png'} key={i} className={crystalClassNames.join(' ') }></img>);
		}
		var tray = (
			<div className="tray">
				<span>{available}/{resources}</span>
				{crystals}
			</div>
		);

		var classNames = this.props.isTop ? 'player top' : 'player';

		if (this.props.isTop) {
			return (
				<div className={classNames}>
					{hand}
					<div className="equipment">
						<div className="player-info">
							{rank}
							{name}
						</div>
						<div></div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{tray}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{field}
				</div>
			);
		}
		else {
			return (
				<div className={classNames}>
					{field}
					<div className="equipment">
						<div className="player-info">
							{rank}
							{name}
						</div>
						<div></div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{tray}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{hand}
				</div>
			);
		}
	}

	public shouldComponentUpdate(nextProps: PlayerProps, nextState) {
		return (
			this.props.player !== nextProps.player ||
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.optionCallback !== nextProps.optionCallback ||
			this.props.cardOracle !== nextProps.cardOracle ||
			this.props.cards !== nextProps.cards
		);
	}
}

export default Player;

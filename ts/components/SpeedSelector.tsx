import * as React from "react";
import {StreamScrubber} from "../interfaces";
import Timeline from "./Timeline";

interface SpeedSelectorProps extends React.Props<any> {
	speed: number;
	speeds: number[];
	selectSpeed: (speed:number) => void;
	disabled?: boolean;
}

class SpeedSelector extends React.Component<SpeedSelectorProps, {}> {

	protected changeSpeed(e):void {
		this.props.selectSpeed(+e.target.value);
	}

	public render():JSX.Element {
		var speeds = this.props.speeds.map(function (val) {
			return <option key={val} value={''+val}><span>{val}&times;</span></option>;
		}.bind(this));

		return (
			<select onChange={this.changeSpeed.bind(this)} value={''+this.props.speed}
					disabled={this.props.disabled} title="Playback speed">
				{speeds}
			</select>
		);

	}
}

export default SpeedSelector;
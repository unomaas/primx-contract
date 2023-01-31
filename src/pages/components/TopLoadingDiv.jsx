import React from 'react'
import { Backdrop, Fade } from '@material-ui/core';
import { useSelector } from 'react-redux';

export default function TopLoadingDiv() {
	return (
		<Backdrop
			open={true}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: "1000",
				// marginTop: "-15%",
			}}
		>
			<Fade in={true}>
				<img
					src="./images/PrimXAnimation.png"
					alt="PrimX Loading Animation"
				/>
			</Fade>
		</Backdrop>
	)
}

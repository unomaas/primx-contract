import React from 'react'
import { Backdrop, Fade } from '@material-ui/core';
import { useSelector } from 'react-redux';

export default function TopLoadingDiv() {
	const showTopLoadingDiv = useSelector(store => store.backdropReducer.showTopLoadingDiv);
	if (!showTopLoadingDiv) return null;

	return (

		<Backdrop
			open={showTopLoadingDiv}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: "1000",
				// marginTop: "-15%",
			}}
		>
			<Fade in={showTopLoadingDiv}>
				<img
					src="./images/PrimXAnimation.png"
					alt="PrimX Loading Animation"
				/>
			</Fade>
		</Backdrop>
	)
}

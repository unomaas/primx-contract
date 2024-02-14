import useCsvFileUpload from "../../hooks/useCsvFileUpload";
import { Button, Tooltip } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';

export default function ImportButton({ columns, rows, setRows, mapping }) {

	const { handleFileUpload } = useCsvFileUpload(columns, rows, setRows, mapping);

	return (
		<>
			<input
				type="file"
				id="csv-upload"
				style={{ display: 'none' }}
				onChange={handleFileUpload}
			/>

			<Tooltip
				title={<p>Upload a CSV file to load the data in the table automatically.<br /> <br />Please note that the spreadsheet headers and destination names must match *exactly* as it's shown on the table. Destination order does not matter as long as the destination name is spelled correctly.<br /> <br />For example, the easiest way to upload a CSV will be to first export a CSV from the table, and modify the data in that spreadsheet, as the headers and destination's will be correct.</p>}
				placement="right-start"
				arrow
			>
				<Button
					color="primary"
					onClick={() => document.getElementById('csv-upload').click()}
				>
					<PublishIcon color="primary" style={{
						marginLeft: "-5px",
						marginRight: "5px",
					}} /> Upload CSV
				</Button>
			</Tooltip>
		</>
	); // End return
}; // End ImportButton

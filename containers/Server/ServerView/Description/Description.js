import React from "react";
import Button from "../../../../components/UI/Button/Button";

export const description = (props) => {


	return (
		<div className="container d-flex flex-column">
			<div className="row  mb-3">
			
					<img
						alt={`Server advertisement banner for ${props.name}`}
						title={`Server advertisement banner for ${props.name}`}
						className="mb-4 mx-auto col-sm-12 mt-4"
						height={64}
						src={`${process.env.NEXT_PUBLIC_api}servers/${props.id}/banner`}
					/>
			
			</div>

			<div className="row">
				<div className="col-md-12">
					<p className="text-break text-justify overflow-y-scroll">{props.description}</p>
				</div>
			</div>

			<Button className="w-100 mt-4" clicked={props.voteClicked}>Vote</Button>
		</div>
	);
};

export default description;

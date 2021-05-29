import React from "react";
import Layout from "../../hoc/Layout/Layout";
import { wrapper } from "../../redux";
import { checkServerSideCookie } from "../../redux/actions/auth";


export const tosIndex = (props) => (
	<Layout authenticated={props.token ? true : false}>
		<form className="container p-4">
			<div className="col-md-12">
				<div className="row">
					<h2 className="mx-auto">Privacy Policy</h2>
				</div>

				<div className="row mt-3">
					<p>
						Your privacy is important to us. It is Creeperlist's policy
						to respect your privacy regarding any information we may
						collect from you across our website, <a href="http://example.com">domain</a>,
						and other sites we own and operate.
					</p>
				</div>

				<div className="row mt-2">
					<p>
						We only ask for personal information when we truly need
						it to provide a service to you. We collect it by fair
						and lawful means, with your knowledge and consent. We
						also let you know why we’re collecting it and how it
						will be used.
					</p>
				</div>

				<div className="row mt-2">
					<p>
						We only retain collected information for as long as
						necessary to provide you with your requested service.
						What data we store, we’ll protect within commercially
						acceptable means to prevent loss and theft, as well as
						unauthorized access, disclosure, copying, use or
						modification.
					</p>
				</div>

				<div className="row mt-2">
					<p>
						We only retain collected information for as long as
						necessary to provide you with your requested service.
						What data we store, we’ll protect within commercially
						acceptable means to prevent loss and theft, as well as
						unauthorized access, disclosure, copying, use or
						modification.
					</p>
				</div>

				<div className="row mt-2">
					<p>
						We don’t share any personally identifying information
						publicly or with third-parties, except when required to
						by law.
					</p>
				</div>

				<div className="row mt-2">
					<p>
						Our website may link to external sites that are not
						operated by us. Please be aware that we have no control
						over the content and practices of these sites, and
						cannot accept responsibility or liability for their
						respective privacy policies.
					</p>
				</div>

				<div className="row mt-2">
					<p>
						You are free to refuse our request for your personal
						information, with the understanding that we may be
						unable to provide you with some of your desired
						services.
					</p>
				</div>

				<div className="row mt-2">
					<p>
						Your continued use of our website will be regarded as
						acceptance of our practices around privacy and personal
						information. If you have any questions about how we
						handle user data and personal information, feel free to
						contact us.
					</p>
				</div>

				<div className="row mt-2 text-center text-bold">
					<p className="mx-auto"><strong>This policy is effective as of 2 February 2021.</strong></p>
				</div>
			</div>
		</form>
	</Layout>
);


export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
	  await checkServerSideCookie(context);


	  const token = context.store.getState().authReducer.token;


	  return {
		props: {
		  token,
		},
	  };
	}
  );
  

export default tosIndex;

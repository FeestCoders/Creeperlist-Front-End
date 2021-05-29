import React from "react";
import Layout from "../../hoc/Layout/Layout";
import { wrapper } from "../../redux";
import { checkServerSideCookie } from "../../redux/actions/auth";

export const tosIndex = (props) => (
	<Layout authenticated={props.token ? true : false}>
		<form className="container p-4">
			<div className="col-md-12">
				<div className="row">
					<h2 className="mx-auto">
						Website Terms and Conditions of Use
					</h2>
				</div>

				<div className="row mt-4">
					<h4>1. Terms</h4>
				</div>
				<div className="row">
					<p>
						{" "}
						By accessing this Website, accessible from
						example.com, you are agreeing to be bound by these
						Website Terms and Conditions of Use and agree that you
						are responsible for the agreement with any applicable
						local laws. If you disagree with any of these terms, you
						are prohibited from accessing this site. The materials
						contained in this Website are protected by copyright and
						trade mark law.
					</p>
				</div>

				<div className="row mt-2">
					<h4>2. Use License</h4>
				</div>
				<div className="row">
					<p>
						Permission is granted to temporarily download one copy
						of the materials on Creeperlist's Website for personal,
						non-commercial transitory viewing only. This is the
						grant of a license, not a transfer of title, and under
						this license you may not: modify or copy the materials;
						use the materials for any commercial purpose or for any
						public display; attempt to reverse engineer any software
						contained on Creeperlist's Website; remove any copyright or
						other proprietary notations from the materials; or
						transferring the materials to another person or "mirror"
						the materials on any other server. This will let
						Creeperlist to terminate upon violations of any of these
						restrictions. Upon termination, your viewing right will
						also be terminated and you should destroy any downloaded
						materials in your possession whether it is printed or
						electronic format.
					</p>
				</div>

				<div className="row mt-2">
					<h4>3. Disclaimer</h4>
				</div>
				<div className="row">
					<p>
						All the materials on Creeperlist’s Website are provided "as
						is". Creeperlist makes no warranties, may it be expressed
						or implied, therefore negates all other warranties.
						Furthermore, Creeperlist does not make any representations
						concerning the accuracy or reliability of the use of the
						materials on its Website or otherwise relating to such
						materials or any sites linked to this Website.
					</p>
				</div>

				<div className="row mt-2">
					<h4>4. Limitations</h4>
				</div>
				<div className="row">
					<p>
						Creeperlist or its suppliers will not be hold accountable
						for any damages that will arise with the use or
						inability to use the materials on Creeperlist’s Website,
						even if Creeperlist or an authorize representative of this
						Website has been notified, orally or written, of the
						possibility of such damage. Some jurisdiction does not
						allow limitations on implied warranties or limitations
						of liability for incidental damages, these limitations
						may not apply to you.
					</p>
				</div>

				<div className="row mt-2">
					<h4> 5. Revisions and Errata</h4>
				</div>
				<div className="row">
					<p>
						The materials appearing on Creeperlist’s Website may
						include technical, typographical, or photographic
						errors. Creeperlist will not promise that any of the
						materials in this Website are accurate, complete, or
						current. Creeperlist may change the materials contained on
						its Website at any time without notice. Creeperlist does
						not make any commitment to update the materials.
					</p>
				</div>

				<div className="row mt-2">
					<h4>6. Links</h4>
				</div>
				<div className="row">
					<p>
						{" "}
						Creeperlist has not reviewed all of the sites linked to its
						Website and is not responsible for the contents of any
						such linked site. The presence of any link does not
						imply endorsement by Creeperlist of the site. The use of
						any linked website is at the user’s own risk.
					</p>
				</div>

				<div className="row mt-2">
					<h4> 7. Site Terms of Use Modifications</h4>
				</div>
				<div className="row">
					<p>
						Creeperlist may revise these Terms of Use for its Website
						at any time without prior notice. By using this Website,
						you are agreeing to be bound by the current version of
						these Terms and Conditions of Use.
					</p>
				</div>

				<div className="row mt-2">
					<h4> 8. Your Privacy</h4>
				</div>
				<div className="row">
					<p> Please read our <a href="/privacy">Privacy Policy</a>.</p>
				</div>

				<div className="row mt-2">
					<h4> 9. Governing Law </h4>
				</div>
				<div className="row">
					<p>
						Any claim related to Creeperlist's Website shall be
						governed by the laws of af without regards to its
						conflict of law provisions.
					</p>
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

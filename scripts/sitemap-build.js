const fs = require("fs");
const globby = require("globby");
const prettier = require("prettier");
const db = require("./dbConnector.js");
const axios = require("axios");

const getDate = new Date().toISOString();

const CREEPERLIST_DOMAIN = "https://example.com";

const formatted = (sitemap) => prettier.format(sitemap, { parser: "html" });

const run = async () => {
	const pages = await globby([
		// include
		"./pages/**/*.js",
		"./pages/*.js",
		// exclude
		"!./pages/_*.js",
		"!./pages/**/[*].js",
		"!./pages/*/[*].js",
	]);

	const pagesSitemap = `
    ${pages
		.map((page) => {
			if (page.match(/\[(.*)\]/)) return "";

			const path = page
				.replace("./pages/", "")
				.replace(".js", "")
				.replace(/\/index/g, "");
			const routePath = path === "index" ? "" : path;
			return `
          <url>
            <loc>${CREEPERLIST_DOMAIN}/${routePath}</loc>
            <lastmod>${getDate}</lastmod>
          </url>
        `;
		})
		.join("")}
  `;

	await axios.get("http://Creeperlist-aus.azurewebsites.net/server-ids").then((result) => {
		const ids = result.data;

		const serversMaps=  ids.map((id) => {
			return `<url>
              <loc>${CREEPERLIST_DOMAIN}/server/${id.Id}</loc>
              <lastmod>${getDate}</lastmod>
            </url>`;
		}).join("");

		const generatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
                                  <urlset
                                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                  >
                              ${pagesSitemap}

                              ${serversMaps}
                            </urlset>
`;

		console.log(serversMaps);

		const formattedSitemap = [formatted(generatedSitemap)];

		console.log("formattedSitemap");

		try {
			fs.writeFileSync(
				"./.next/static/sitemap.xml",
				formattedSitemap,
				"utf8"
			);
		} catch {
			console.log("Failed to write sitemap.xml");
		}
	});
};

run();

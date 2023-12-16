import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  //brightdata proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: `brd.superproxy.io`,
    port,
    rejectUnauthrized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $("#productTitle").text().trim();
    let currentPrice = extractPrice(
      $(".a-price-whole:first")
      // $(".priceTopay span.a-price-whole"),
      // $("a.size.base.a-color-price"),
      // $(".a-button-selected .a-color-base")
    );
    console.log({ title, currentPrice });
  } catch (error: any) {
    throw new Error(`Faled to scrape product : ${error.message}`);
  }
}

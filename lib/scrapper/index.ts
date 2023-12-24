import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

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

    const originalPrice = extractPrice(
      $(".a-price.a-text-price .a-offscreen:first")
    );

    const outOfStock =
      $("availablity span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      $(".a-dynamic-image.a-stretch-vertical").attr("data-a-dynamic-image") ||
      $(".a-dynamic-image.a-stretch-horizontal").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const ratings = $(".a-size-base.a-color-base").text().trim().split(" ");

    const reviewCount =
      $("#acrCustomerReviewText").text().trim().split(" ")[0] || 0;

    const description = extractDescription($);

    //Construct data object with scraped information
    const data = {
      url,
      currency: currency || " ₹",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewCount: Number(reviewCount),
      stars: ratings[0],
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Faled to scrape product : ${error.message}`);
  }
}

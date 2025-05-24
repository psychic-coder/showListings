class ListingsApp {
  constructor() {
    this.listings = [];
    this.filteredListings = [];
    this.showOnlyShortlisted = false;
    this.init();
  }

  async init() {
    await this.fetchListings();
    this.renderListings();
    this.setupEventListeners();
  }

  async fetchListings() {
    try {
      const response = await fetch("http://localhost:3000/api/listings");
      if (!response.ok) throw new Error("Failed to fetch listings");
      this.listings = await response.json();
      this.filteredListings = [...this.listings];
    } catch (error) {
      console.error("Error fetching listings:", error);
      document.getElementById("loading").innerHTML =
        '<div class="error">Failed to load listings. Please try again.</div>';
    }
  }

  async fetchShortlisted() {
    try {
      const response = await fetch("http://localhost:3000/api/shortlisted");
      if (!response.ok) throw new Error("Failed to fetch shortlisted");
      this.filteredListings = await response.json();
      this.renderListings();
    } catch (error) {
      console.error("Error fetching shortlisted:", error);
    }
  }

  async toggleShortlist(id, isCurrentlyShortlisted) {
    try {
      const endpoint = isCurrentlyShortlisted ? "unshortlist" : "shortlist";
      const response = await fetch(
        `http://localhost:3000/api/listings/${id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to ${endpoint}`);

      
      const listing = this.listings.find((l) => l.id === id);
      if (listing) {
        listing.is_shortlisted = !isCurrentlyShortlisted;
      }

      
      if (this.showOnlyShortlisted) {
        await this.fetchShortlisted();
      } else {
        this.renderListings();
      }
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  }

  renderListings() {
    const container = document.getElementById("listings-container");

    if (this.filteredListings.length === 0) {
      container.innerHTML = '<div class="loading">No listings found.</div>';
      return;
    }

    container.innerHTML = this.filteredListings
      .map((listing) => {
        const priceCategory = this.getPriceCategory(parseFloat(listing.amount));
        const stars = this.renderStars(listing.stars);

        return `
                <div class="listing-card ${
                  listing.company_name.toLowerCase().includes("epic")
                    ? "epic-designs"
                    : listing.company_name.toLowerCase().includes("studio")
                    ? "studio-d3"
                    : ""
                }">
                    <div class="listing-header">
                        <div class="listing-content">
                            <h2 class="company-name">${
                              listing.company_name
                            }</h2>
                            <div class="stars">${stars}</div>
                            <p class="description">${listing.description}</p>
                            <div class="stats">
                                <div class="stat">
                                    <div class="stat-number">${
                                      listing.projects || 57
                                    }</div>
                                    <div class="stat-label">Projects</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">${
                                      listing.years_of_experience
                                    }</div>
                                    <div class="stat-label">Years</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">${priceCategory}</div>
                                    <div class="stat-label">Price</div>
                                </div>
                            </div>
                            <div class="contact-info">
                                <div class="phone">+91 - ${
                                  listing.phone_number
                                }</div>
                                <div class="phone">+91 - ${
                                  listing.phone_number
                                }</div>
                            </div>
                        </div>
                        <div class="actions">
                            <button class="action-btn">
                                <div class="action-icon">
                                   <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.75 10.9999C5.75 10.8176 5.82573 10.6427 5.96052 10.5138C6.09531 10.3848 6.27813 10.3124 6.46875 10.3124H14.7962L11.7099 7.36164C11.5749 7.23255 11.4991 7.05746 11.4991 6.87489C11.4991 6.69233 11.5749 6.51724 11.7099 6.38814C11.8448 6.25905 12.0279 6.18652 12.2188 6.18652C12.4096 6.18652 12.5927 6.25905 12.7276 6.38814L17.0401 10.5131C17.1071 10.577 17.1602 10.6529 17.1964 10.7364C17.2326 10.8199 17.2513 10.9095 17.2513 10.9999C17.2513 11.0903 17.2326 11.1799 17.1964 11.2634C17.1602 11.3469 17.1071 11.4228 17.0401 11.4866L12.7276 15.6116C12.5927 15.7407 12.4096 15.8133 12.2188 15.8133C12.0279 15.8133 11.8448 15.7407 11.7099 15.6116C11.5749 15.4825 11.4991 15.3075 11.4991 15.1249C11.4991 14.9423 11.5749 14.7672 11.7099 14.6381L14.7962 11.6874H6.46875C6.27813 11.6874 6.09531 11.615 5.96052 11.486C5.82573 11.3571 5.75 11.1822 5.75 10.9999Z" fill="#8D4337"/>
</svg>

                                </div>
                                <div class="action-label">Details</div>
                            </button>
                            <button class="action-btn hide-btn">
                                <div class="action-icon">
                                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_12_501)">
<path d="M16.6988 14.0475C18.825 12.15 20 10 20 10C20 10 16.25 3.125 10 3.125C8.7995 3.12913 7.61258 3.37928 6.51251 3.86L7.47501 4.82375C8.28431 4.52894 9.1387 4.3771 10 4.375C12.65 4.375 14.8488 5.835 16.46 7.44625C17.2355 8.22586 17.9306 9.08141 18.535 10C18.4625 10.1087 18.3825 10.2288 18.2913 10.36C17.8725 10.96 17.2538 11.76 16.46 12.5538C16.2538 12.76 16.0388 12.9637 15.8138 13.1613L16.6988 14.0475Z" fill="#8D4337"/>
<path d="M14.1212 11.47C14.4002 10.6898 14.4518 9.84639 14.2702 9.03798C14.0886 8.22957 13.6811 7.48936 13.0952 6.90348C12.5093 6.3176 11.7691 5.91013 10.9607 5.72849C10.1523 5.54685 9.30893 5.59851 8.52874 5.87745L9.55749 6.9062C10.0379 6.83745 10.5277 6.88151 10.9881 7.03491C11.4485 7.18831 11.8668 7.44682 12.21 7.78997C12.5531 8.13312 12.8116 8.55147 12.965 9.01187C13.1184 9.47227 13.1625 9.96207 13.0937 10.4425L14.1212 11.47ZM10.4425 13.0937L11.47 14.1212C10.6898 14.4001 9.84642 14.4518 9.03801 14.2702C8.2296 14.0885 7.48939 13.6811 6.90351 13.0952C6.31763 12.5093 5.91016 11.7691 5.72852 10.9607C5.54688 10.1523 5.59854 9.3089 5.87749 8.5287L6.90624 9.55745C6.83748 10.0378 6.88154 10.5276 7.03494 10.988C7.18834 11.4484 7.44685 11.8668 7.79 12.2099C8.13315 12.5531 8.5515 12.8116 9.0119 12.965C9.4723 13.1184 9.9621 13.1625 10.4425 13.0937Z" fill="#8D4337"/>
<path d="M4.1875 6.83749C3.9625 7.0375 3.74625 7.24 3.54 7.44625C2.76456 8.22586 2.0694 9.0814 1.465 10L1.70875 10.36C2.1275 10.96 2.74625 11.76 3.54 12.5537C5.15125 14.165 7.35125 15.625 10 15.625C10.895 15.625 11.7375 15.4587 12.525 15.175L13.4875 16.14C12.3874 16.6207 11.2005 16.8708 10 16.875C3.75 16.875 0 10 0 10C0 10 1.17375 7.84875 3.30125 5.9525L4.18625 6.83875L4.1875 6.83749ZM17.0575 17.9425L2.0575 2.9425L2.9425 2.0575L17.9425 17.0575L17.0575 17.9425Z" fill="#8D4337"/>
</g>
<defs>
<clipPath id="clip0_12_501">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>

                                </div>
                                <div class="action-label">Hide</div>
                            </button>
                            <button class="action-btn shortlist-btn ${
                              listing.is_shortlisted ? "active" : ""
                            }" 
        onclick="app.toggleShortlist(${listing.id}, ${listing.is_shortlisted})">
    <div class="action-icon">
        ${
          listing.is_shortlisted
            ? `<svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.92436e-07 20.3438C-9.11286e-05 20.4577 0.0323215 20.5697 0.0940478 20.6688C0.155774 20.7678 0.244686 20.8505 0.352032 20.9086C0.459377 20.9668 0.581456 20.9984 0.706251 21.0004C0.831046 21.0024 0.954255 20.9746 1.06375 20.9199L8.625 17.1531L16.1863 20.9199C16.2957 20.9746 16.419 21.0024 16.5437 21.0004C16.6685 20.9984 16.7906 20.9668 16.898 20.9086C17.0053 20.8505 17.0942 20.7678 17.156 20.6688C17.2177 20.5697 17.2501 20.4577 17.25 20.3438V2.625C17.25 1.92881 16.9471 1.26113 16.4079 0.768845C15.8688 0.276562 15.1375 0 14.375 0L2.875 0C2.1125 0 1.38124 0.276562 0.842068 0.768845C0.302901 1.26113 1.92436e-07 1.92881 1.92436e-07 2.625V20.3438ZM8.625 5.78813C10.6188 3.91781 15.6026 7.1925 8.625 11.4017C1.64738 7.1925 6.63119 3.91913 8.625 5.79075V5.78813Z" fill="#8D4337"/>
</svg>
`
            : `<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 5.78817C13.4938 3.91786 18.4776 7.19255 11.5 11.4017C4.52237 7.19255 9.50618 3.91917 11.5 5.7908V5.78817Z" fill="#8D4337"/>
<path d="M2.875 2.625C2.875 1.92881 3.1779 1.26113 3.71707 0.768845C4.25623 0.276562 4.9875 0 5.75 0L17.25 0C18.0125 0 18.7438 0.276562 19.2829 0.768845C19.8221 1.26113 20.125 1.92881 20.125 2.625V20.3438C20.1249 20.4625 20.0896 20.5789 20.0228 20.6807C19.9559 20.7826 19.8601 20.8659 19.7455 20.922C19.6309 20.978 19.5018 21.0046 19.3719 20.9989C19.242 20.9932 19.1163 20.9555 19.0081 20.8898L11.5 17.1951L3.99194 20.8898C3.8837 20.9555 3.75796 20.9932 3.62809 20.9989C3.49823 21.0046 3.36912 20.978 3.2545 20.922C3.13988 20.8659 3.04406 20.7826 2.97723 20.6807C2.9104 20.5789 2.87507 20.4625 2.875 20.3438V2.625ZM5.75 1.3125C5.36875 1.3125 5.00312 1.45078 4.73353 1.69692C4.46395 1.94306 4.3125 2.2769 4.3125 2.625V19.1179L11.1018 15.8602C11.2198 15.7886 11.3583 15.7503 11.5 15.7503C11.6417 15.7503 11.7802 15.7886 11.8982 15.8602L18.6875 19.1179V2.625C18.6875 2.2769 18.536 1.94306 18.2665 1.69692C17.9969 1.45078 17.6312 1.3125 17.25 1.3125H5.75Z" fill="#8D4337"/>
</svg>
`
        }
    </div>
    <div class="action-label">${
      listing.is_shortlisted ? "Shortlisted" : "Shortlist"
    }</div>
</button>
                            <button class="action-btn">
                                <div class="action-icon">
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_12_414)">
<path d="M8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16Z" fill="#8D4337"/>
<path d="M7.00201 11C7.00201 10.8687 7.02788 10.7386 7.07813 10.6173C7.12839 10.496 7.20205 10.3857 7.29491 10.2929C7.38777 10.2 7.49801 10.1264 7.61933 10.0761C7.74066 10.0259 7.87069 10 8.00201 10C8.13334 10 8.26337 10.0259 8.3847 10.0761C8.50602 10.1264 8.61626 10.2 8.70912 10.2929C8.80198 10.3857 8.87564 10.496 8.92589 10.6173C8.97615 10.7386 9.00201 10.8687 9.00201 11C9.00201 11.2652 8.89666 11.5196 8.70912 11.7071C8.52158 11.8946 8.26723 12 8.00201 12C7.7368 12 7.48244 11.8946 7.29491 11.7071C7.10737 11.5196 7.00201 11.2652 7.00201 11ZM7.10001 4.995C7.0867 4.86884 7.10005 4.74129 7.13921 4.62062C7.17838 4.49996 7.24247 4.38888 7.32733 4.29458C7.4122 4.20029 7.51594 4.12489 7.63183 4.07328C7.74771 4.02167 7.87315 3.995 8.00001 3.995C8.12687 3.995 8.25232 4.02167 8.3682 4.07328C8.48409 4.12489 8.58783 4.20029 8.6727 4.29458C8.75756 4.38888 8.82165 4.49996 8.86081 4.62062C8.89998 4.74129 8.91333 4.86884 8.90001 4.995L8.55001 8.502C8.53825 8.63977 8.47522 8.76811 8.37337 8.86163C8.27152 8.95515 8.13829 9.00705 8.00001 9.00705C7.86174 9.00705 7.7285 8.95515 7.62666 8.86163C7.52481 8.76811 7.46177 8.63977 7.45001 8.502L7.10001 4.995Z" fill="#8D4337"/>
</g>
<defs>
<clipPath id="clip0_12_414">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>

                                </div>
                                <div class="action-label">Report</div>
                            </button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  renderStars(rating) {
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHtml += '<span class="star">★</span>';
      } else if (i - 0.5 <= rating) {
        starsHtml += '<span class="star">☆</span>';
      } else {
        starsHtml += '<span class="star empty">☆</span>';
      }
    }
    return starsHtml;
  }

  getPriceCategory(amount) {
    if (amount < 100000) return "$";
    if (amount < 200000) return "$$";
    return "$$$";
  }

  setupEventListeners() {
  
    document.getElementById("shortlisted-tab").addEventListener("click", () => {
      this.showOnlyShortlisted = !this.showOnlyShortlisted;

      if (this.showOnlyShortlisted) {
        this.fetchShortlisted();
        document.getElementById("shortlisted-tab").classList.add("active");
      } else {
        this.filteredListings = [...this.listings];
        this.renderListings();
        document.getElementById("shortlisted-tab").classList.remove("active");
      }
    });

   
    document.getElementById("sort-tab").addEventListener("click", () => {
      if (this.showOnlyShortlisted) {
        this.fetchShortlisted();
      }
    });
  }
}


document.addEventListener("DOMContentLoaded", () => {
  window.app = new ListingsApp();
});

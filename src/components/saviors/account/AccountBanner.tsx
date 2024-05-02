import { Header } from "../../header/Header";
import { AccountBannerProps } from "./types";

/**
 * Displays some info about the user's account and company.
 */
export function AccountBanner(
  { region, website, joinedDate, name, company, role }: AccountBannerProps
) {

  return (
    <section className="banner">
      <div className="names">
        {role === "company" 
          ? <Header text={company} />
           : (
              <>
                <Header text={name} />
                <Header text={company} fontSize="lg" />
              </>
            )
        }
      </div>
      <div className="icon-row">
        <div className="icon">
          <span className="material-symbols-rounded">date_range</span>
          <div>
            <span className="faded-text">since </span>
            <span>{ new Date(joinedDate).toLocaleString("default", {month: "long", year: "numeric", day: "2-digit"}) }</span>
          </div>
        </div>
        <div className="icon">
          <span className="material-symbols-rounded">public</span>
          <div>
            <span className="faded-text">region</span>
            <span>{ new Intl.DisplayNames(["en"], { type: "region" } ).of(region) }</span>
          </div>
        </div>
        <a href={website} className="icon">
          <span className="material-symbols-rounded">link</span>
          <div>
            <span className="faded-text">company website</span>
            <span>{ website || "www.sprive.com" }</span>
          </div>
        </a>
      </div>
    </section>
  )
}
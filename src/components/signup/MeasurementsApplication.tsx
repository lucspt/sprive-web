import { GHG_CATEGORY_NAMES } from "../../constants";
import GHGCategoryDropdown from "./GHGCategoryDropdown";
import { ScopeSection } from "./ScopeSection";
import "./MeasurementsApplication.css";
import { MeasurementApplicationsProps } from "./types";
import { MouseEvent } from "react";
import { GHGCategory, Scope } from "../../types";

/**
 * A component that handles the step of choosing measurement categories during account creation
 * @param props
 * @param  props.chosen - The currently chosen measurement categories
 * @param props.setFormData - setState function to update the formData measurement_categories field
 * 
 * @returns A component that renders Scopes and categories to choose for account measurements
 */
export default function MeasurementsApplication({ chosen, setFormData }: MeasurementApplicationsProps) {

  // Toggle a measurement category. 
  function toggle(e: MouseEvent<HTMLButtonElement>, isChecked: boolean, category: GHGCategory | Scope) {
    e.stopPropagation();
    setFormData((prev: {measurement_categories: Array<GHGCategory|Scope>}) => {
      const { measurement_categories } = prev;
      let newCates;
      if (isChecked) {
        newCates = measurement_categories.filter((x) => x !== category);
      } else {
        newCates = measurement_categories.concat(category);
      }
      return { ...prev, measurement_categories: newCates };
    });
  }

  return (
    <div className="measurement-choices">
      <div className="choices">
      <div className="desc">
        <p>Select the scopes and categories that apply to your company 
          <span>*</span>
        </p>
        <span>This is what your climate program will track</span>
      </div>
      <ScopeSection 
        scope={"1"} 
        toggle={(e: MouseEvent<HTMLButtonElement>, isChecked: boolean) => toggle(e, isChecked, "1")}
        isChecked={chosen.includes("1")}
      >
      </ScopeSection>
      <ScopeSection 
        scope={"2"} 
        toggle={(e: MouseEvent<HTMLButtonElement>, isChecked: boolean) => toggle(e, isChecked, "2")}
        isChecked={chosen.includes("2")}
      />
      <ScopeSection scope={"3"}>
      { Object.entries(GHG_CATEGORY_NAMES).map(([ category, categoryName ]) => (
          <GHGCategoryDropdown 
            category={category as GHGCategory} 
            name={categoryName} 
            key={category}
            isChecked={chosen.includes(category as GHGCategory)}
            toggle={(e: MouseEvent<HTMLButtonElement>, isChecked: boolean) => toggle(e, isChecked, category as GHGCategory)}
          />
      ))}
      </ScopeSection>
      </div>
      <div className="submit">
        <button 
          type="submit"
          className="default-btn"
          disabled={chosen.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
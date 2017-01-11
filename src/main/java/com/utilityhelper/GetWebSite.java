package com.utilityhelper;

import java.util.HashMap;
import java.util.LinkedHashMap;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.automateOn.Helper.VldElement;
import com.automateOn.Utilities.AOException;
import com.automateOn.Wait.AOWait;

public class GetWebSite {

	public static void openSite(WebDriver driver,
			HashMap<String, String> AOValues, LinkedHashMap<String, String> data)
			throws AOException, InterruptedException {

		/**
		 * Check that DOM is ready
		 */

		WebDriverWait wait = new WebDriverWait(driver, 120);
		try {
			wait.until(VldElement.DOMReady);
			
			driver.navigate().to(data.get("SiteURL"));
			
			AOWait.domReady(driver, AOValues);

		} catch (TimeoutException e) {
			e.printStackTrace();
		}
		try {
			driver.manage().window().maximize();
		} catch (Exception e) {
			// TODO:handle for mobile browsers
		}

	}

}

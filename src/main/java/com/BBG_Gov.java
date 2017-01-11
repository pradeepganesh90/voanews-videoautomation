package com;

import java.util.Hashtable;
import java.util.LinkedHashMap;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.events.EventFiringWebDriver;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.applitools.eyes.Eyes;
import com.automateOn.AutomateOnReport.exec.AutomateOnReport;
import com.automateOn.Commands.SuitesParameters;
import com.automateOn.Utilities.AOException;
import com.automateOn.applitool.Applitools;
import com.automateOn.main.AutomateOn;
import com.pageobjects.HomePage;
import com.pageobjects.ScienceAndHealth;
import com.pageobjects.SiliconValleyAndTech;
import com.utilityhelper.GetDataProvider;
import com.utilityhelper.GetWebSite;
import com.utilityhelper.PropLoad;

/**
 * @author pradeep.ganesh
 * This is the Main Class which extends AutomateOn Base Class to Validate and Generate reports.
 *
 */
public class BBG_Gov extends AutomateOn {

	/**
	 * This Method is the testActivityforStartUp to do all the initial Setup
	 *
	 */
	@Test(groups = "BBG_Gov",alwaysRun = true)
	public void bbg_gov() throws Exception {
		AutomateOnReport CR = null;
		Eyes eyes = new Eyes();
		WebDriver driver = null;
		System.setProperty("webdriver.chrome.driver", "C:/Users/pradeep.ganesh/Desktop/chromedriver.exe");
		driver = new ChromeDriver();
		try {
			
			Hashtable<String, Object> customCapabilities = new Hashtable<>();
			if(SuitesParameters.getEnvironment().toLowerCase().contains("browserstack"))
				customCapabilities.put("acceptSslCerts", "true");

			String methodName = this.getClass().getName() + "." + Thread.currentThread().getStackTrace()[1].getMethodName();
			boolean browserstatus=true;
			try{
				synchronized (this) {
					driver = this.testActivityforStartUp("", "Cireson_Test", methodName, customCapabilities);
				}
			}
			catch(AOException invocation)
			{
				browserstatus=false;
			}
			catch(Exception browserinvocation)
			{
				browserstatus=false;
			}
			/*
			 * This peace of code can be copied to every action class to get the
			 * data
			 */
			LinkedHashMap<String, String> data = new LinkedHashMap<String, String>();
			GetDataProvider getDataProvider = new GetDataProvider();
			data = getDataProvider.fetch(this.getClass().getSimpleName(),
					dataProvider);
			
			CR = new AutomateOnReport(getTestCaseValues(), driver, methodName);
			if(!browserstatus)
			{
				CR.TestCaseFailed("Step", "There is an trouble in invoking the browser", "", "");
			}


			/*
			 * Custom Report Declaration
			 */

			if (getTestCaseValues().get("isUiValidation").toLowerCase().equals("true")) {

				eyes.setApiKey(getTestCaseValues().get("applitoolApiKey"));
				if(SuitesParameters.isHighlightClick())
				{
					eyes.open(((EventFiringWebDriver) driver).getWrappedDriver(), getTestCaseValues().get("testSuiteName"),
							getTestCaseValues().get("testngClassName")+methodName);
				}else
				{
					eyes.open(driver, getTestCaseValues().get("testSuiteName"),
							getTestCaseValues().get("testngClassName")+methodName);
				}

			}

			GetWebSite.openSite(driver, getTestCaseValues(), data);
			
			HomePage homepage = new HomePage(driver, getTestCaseValues(), CR, eyes);	
			
			homepage.validateVideoInSlider("TestStep", PropLoad.crMsg("Click_Video_Slider"));

			ScienceAndHealth scienceAndHealth = new ScienceAndHealth(driver, getTestCaseValues(), CR, eyes);			
			
			scienceAndHealth.validateVideoFiles("TestStep", PropLoad.crMsg("Click_Video_DivSHP"));
			
			SiliconValleyAndTech siliconValleyAndTech = new SiliconValleyAndTech(driver, getTestCaseValues(), CR, eyes);			
			
			siliconValleyAndTech.validateVideoFiles("TestStep", PropLoad.crMsg("Click_Video_DivSVT"));
			
		} catch (AOException automateOnException) {
			automateOnException.printStackTrace();
			CR.TestCaseFailed("Step", "Application Error has Occured", "",
					automateOnException.getMessage());
			Assert.fail(
					"Application Errors : " + automateOnException.getMessage(),
					automateOnException);
		} catch (Exception exception) {
			exception.printStackTrace();
			CR.TestCaseFailed("Step", "Technical Error has Occured", "",
					exception.getMessage());
			throw exception;

		}finally {
			try {
				Applitools.quit(eyes, getTestCaseValues());
			} catch (AOException e) {
			}

			// Abort test in case of an unexpected error.
			try {
				eyes.abortIfNotClosed();
			} catch (Exception e1) {
			}
			if(driver!=null)
			{
				driver.quit();
			}
		}
	}

}

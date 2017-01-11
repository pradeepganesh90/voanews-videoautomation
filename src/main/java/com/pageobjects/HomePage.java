package com.pageobjects;

import java.util.HashMap;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import com.applitools.eyes.Eyes;
import com.automateOn.AutomateOnReport.exec.AutomateOnReport;
import com.automateOn.Utilities.AOException;
import com.utilityhelper.PropLoad;

/**
 * @author pradeep.ganesh
 * Class HomePage is used to Validate the HomePage activity. 
 * 
 */

public class HomePage {

	private final WebDriver driver;

	private final HashMap<String, String> AOValues;

	private String webSite = null;
	private String browser = null;
	private String browserVersion = null;
	private final AutomateOnReport CR;
	private final Eyes eyes;

	public HomePage(WebDriver driver, HashMap<String, String> AOValues, AutomateOnReport CR, Eyes eyes) {
		super();
		this.driver = driver;
		this.AOValues = AOValues;
		this.CR = CR;
		this.eyes=eyes;
		this.webSite = AOValues.get("website");
		this.browser = AOValues.get("browser");
		this.browserVersion = AOValues.get("browserVersion");
	}

	public HomePage validateVideoInSlider(String typeOfStep, String stepDesc) {
		WebDriverWait wait= new WebDriverWait(driver,100);
		try {
			JavascriptExecutor js;
			if (driver instanceof JavascriptExecutor) {
				js = (JavascriptExecutor)driver;
				js.executeScript("function test() {var elementsLI = document.getElementsByClassName('holder')[0].getElementsByTagName('li');"+
						"for(var i=0;i<elementsLI.length;i++){"+
						"var elementsI = elementsLI[i].getElementsByTagName('i');"+
						"if(typeof elementsI[0] != 'undefined' && elementsI['0'].className.indexOf('video') > -1){"+
						"elementsLI[i].getElementsByTagName('img')[0].click(); return;"+
						"}"+
						"}"+
						"};  return test()");	
				CR.TestCasePass(typeOfStep, stepDesc, "");
				Thread.sleep(10000);
				pauseVideoClick(driver, "SubStep", PropLoad.crMsg("PauseVideo"));
				WebElement durationValue = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//span[@class='duration' and @dir='ltr']")));
				isVideoDurationTrue(durationValue.getAttribute("innerHTML"));   
				WebElement playBtn = driver.findElement(By.xpath("//div[@class='playBigFg']"));
				isPlayButtonEnabled(playBtn);
				Thread.sleep(3000);
				CR.TestCasePass("SubStep", PropLoad.crMsg("PlayButton"), "");		
				skipVideoClip("SubStep", PropLoad.crMsg("SkipVideo"), "");
				playVideoClick("SubStep", PropLoad.crMsg("PlayVideo"), "");
				Thread.sleep(8000);
				driver.navigate().back();
				Thread.sleep(5000);
				
			} else {
				throw new IllegalStateException("This driver does not support JavaScript!");
			}

		} catch (Exception e) {

			try {
				CR.TestCaseFailed(typeOfStep, stepDesc, "", e.getMessage());
				throw new AOException(PropLoad.crMsg("customError") + " : "
						+ stepDesc, e);
			} catch (AOException e1) {
				e1.printStackTrace();
			}

		}		
		return this;
	}

	/**
	 * @param typeOfStep - SubStep
	 * @param crMsg - SubStep To Play Video. 
	 * @param string2 - null
	 */
	private void playVideoClick(String typeOfStep, String crMsg, String string2) {
		try {
			JavascriptExecutor js = (JavascriptExecutor) driver;
			js.executeScript("document.getElementsByTagName(\"video\")[0].play()");
			Thread.sleep(2000);
			CR.TestCasePass(typeOfStep, crMsg, "");
			}catch (Exception e) {
		 	 e.printStackTrace();
		    }
	}

	/**
	 * @param typeOfStep - SubStep
	 * @param crMsg - SubStep To Skip Video To 10 Seconds Forward.
	 * @param string2 - null
	 */
	private void skipVideoClip(String typeOfStep, String crMsg, String string2) {
		try {
			JavascriptExecutor js = (JavascriptExecutor) driver;
			js.executeScript("document.getElementsByTagName(\"video\")[0].currentTime = 20");
			Thread.sleep(1000);
			CR.TestCasePass(typeOfStep, crMsg, "");
			}catch (Exception e) {
		 	 e.printStackTrace();
		    }
				
	}

	/**
	 * @param playBtn
	 */
	private void isPlayButtonEnabled(WebElement playBtn) {
		 Assert.assertEquals(true, playBtn.isDisplayed());
	}

	/**
	 * @param durationText - Getting Duration in text
	 */
	private void isVideoDurationTrue(String durationText) {
		Assert.assertTrue(getHoursOrMinutes(durationText), "Video needs to contain duration");
	}

	/**
	 * @param duration - Check whether duration contains seconds or minutes greater than 0.
	 */
	private boolean getHoursOrMinutes(String duration) {
		if(Integer.parseInt(duration.substring(3,5)) > 0 || Integer.parseInt(duration.substring(6,duration.length()-1)) > 0){
			try {
				Thread.sleep(2000);
				CR.TestCasePass("SubStep", PropLoad.crMsg("Duration"), "");
			} catch (Exception e) {
				e.printStackTrace();
			}
			return true;
		}
		else{		    		   
			return false;
		}
	}

	/**
	 * @param driver2
	 * @param typeOfStep - SubStep  
	 * @param stepDesc - SubStep Content loaded from Properties file
	 */
	private void pauseVideoClick(WebDriver driver2, String typeOfStep, String stepDesc) {

		try {
			JavascriptExecutor js = (JavascriptExecutor) driver2;
			js.executeScript("document.getElementsByTagName(\"video\")[0].pause()");
			Thread.sleep(2000);
			CR.TestCasePass(typeOfStep, stepDesc, "");			
		}catch (Exception e) {
			e.printStackTrace();
		}

	}



}

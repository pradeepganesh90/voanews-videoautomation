package com.utilityhelper;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Properties;

import javax.ws.rs.core.UriBuilder;

import org.openqa.selenium.WebDriver;

import com.automateOn.Utilities.AOException;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

public class PropLoad {

	private String _path;

	private static Properties prop = new Properties();

	private PropLoad(String _path) throws AOException {
		super();
		this._path = _path;

		try {
			prop.load(new FileInputStream(this._path));
		} catch (IOException e) {
			throw new AOException("Error Loading the properties file ", e);
		}

	}

	public static String crMsg(String _reportString, String _arg)
			throws AOException {
		String errorMsg = null;
		new PropLoad("CustomReport.properties");

		if (_arg != null) {
			errorMsg = prop.getProperty(_reportString);
			errorMsg = MessageFormat.format(errorMsg, _arg);

			return errorMsg.replace("\"", "&quote;");
		} else {
			errorMsg = prop.getProperty(_reportString);

			return errorMsg;
		}
	}

	public static String crMsg(String _reportString) throws AOException {
		return crMsg(_reportString, null);
	}

	public static String getJsonPageSource(String env, WebDriver driver,
			String productID, String ItemID, HashMap<String, String> AOValues,
			HashMap<String, String> data) throws AOException,
			UnsupportedEncodingException {
		String output = "";
		try {

			Client client = Client.create();

			WebResource webResource = client.resource(getBaseURI(productID,
					ItemID, data));

			ClientResponse response = webResource.accept("application/json")
					.get(ClientResponse.class);

			if (response.getStatus() != 200) {
				System.out.println(response.getEntity(String.class));
			} else {
				output = response.getEntity(String.class);
				System.out.println("Output from Server .... \n");
				System.out.println(output);
			}

			File file = new File(".", "JsonFiles");
			String fullpath = new File(file.getAbsolutePath(),
					env.toUpperCase()).getAbsolutePath();

			File file1 = new File(File.separator + fullpath + File.separator
					+ ItemID.trim() + ".json");

			FileWriter writer = new FileWriter(file1.getAbsoluteFile());

			writer.write(output);
			writer.close();

			String reportPath = AOValues.get("automateOn-ReportPath");
			System.out.println(reportPath);

			File jsonFile = new File(reportPath + File.separator + "json_files");
			if (!jsonFile.exists()) {
				if (jsonFile.mkdirs()) {
					System.out.println("JsonFile created");
				} else {
					System.out.println("Failed to create JsonFolder!");
				}
			}
			File jsonFileInreports = new File(File.separator + reportPath
					+ File.separator + "json_files" + File.separator
					+ AOValues.get("browser") + ItemID.trim() + ".json");

			FileWriter jsonFilewriter = new FileWriter(
					jsonFileInreports.getAbsoluteFile());
			jsonFilewriter.write(output);
			jsonFilewriter.close();

		} catch (IOException e) {
			throw new AOException("Error to writing the json file", e);
		}

		return "";
	}

	private static URI getBaseURI(String productID, String ItemID,
			HashMap<String, String> data) {
		URI url = null;
		if (data.get("Environment").trim().toLowerCase().equals("test")) {

			url = UriBuilder
					.fromUri(
							"http://test.xquire.com/index.xqy?_p=triumph&_c=rest&_f=get-json-item-editor&productID="
									+ productID + "&itemID=" + ItemID).build();
		} else if (data.get("Environment").trim().toLowerCase()
				.equals("triumph")) {
			url = UriBuilder
					.fromUri(
							"http://triumph.xquire.com/index.xqy?_p=triumph&_c=rest&_f=get-json-item-editor&productID="
									+ productID + "&itemID=" + ItemID).build();
		} else if (data.get("Environment").trim().toLowerCase().equals("prod")) {
			url = UriBuilder
					.fromUri(
							"http://xquirecms.triumphlearning.net/index.xqy?_p=triumph&_c=rest&_f=get-json-item-editor&productID="
									+ productID
									+ "&itemID="
									+ ItemID
									+ "&type-retrun=json").build();

		} else {
			url = UriBuilder
					.fromUri(
							"http://helios-dev-web.triumphlearning.net/SysAdmin/ItemDBExplorer/api/AMItem/?&_f=getAll&productID="
									+ productID
									+ "&itemID="
									+ ItemID
									+ "&type-retrun=json&hintId=1").build();
		}
		return url;

	}
}

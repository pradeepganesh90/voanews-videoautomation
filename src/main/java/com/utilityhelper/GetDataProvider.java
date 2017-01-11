package com.utilityhelper;

import java.util.LinkedHashMap;

import com.automateOn.Utilities.AOException;

public class GetDataProvider {

	public LinkedHashMap<String, String> fetch(String className,
			LinkedHashMap<String, LinkedHashMap<String, String>> _dataProvider)
			throws AOException {

		/*
		 * Fetch the value based on
		 */
		for (String str : _dataProvider.keySet()) {
			if (str.trim().toLowerCase().equals(className.trim().toLowerCase())) {
				System.out.println("Fetched value for Class: " + className
						+ " and value is:" + _dataProvider.get(str));
				return _dataProvider.get(str);
			}
		}

		return null;

	}

}

function normalizeDomainRule(rule) {
  let value = rule.trim().toLowerCase();
  if (!value) {
    return "";
  }

  value = value.replace(/^(https?:\/\/)\*\./, "$1").replace(/^\*\./, "");

  try {
    const domainUrl = new URL(
      value.includes("://") ? value : `https://${value}`,
    );
    return domainUrl.hostname.replace(/^\.+|\.+$/g, "");
  } catch (e) {
    return "";
  }
}

function parseDomainRules(rulesText) {
  return rulesText
    .split(/[\s,]+/)
    .map((rule) => normalizeDomainRule(rule))
    .filter((rule) => !!rule);
}

function domainMatchesRule(hostname, rule) {
  return hostname === rule || hostname.endsWith(`.${rule}`);
}

export function shouldStripQueryParameters(url, rulesText) {
  const rules = parseDomainRules(rulesText || "");
  if (!rules.length) {
    return false;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return rules.some((rule) => domainMatchesRule(hostname, rule));
  } catch (e) {
    return false;
  }
}

export function stripQueryParametersForMatchingDomain(url, rulesText) {
  if (!shouldStripQueryParameters(url, rulesText)) {
    return url;
  }

  try {
    const normalizedUrl = new URL(url);
    normalizedUrl.search = "";
    return normalizedUrl.toString();
  } catch (e) {
    return url;
  }
}

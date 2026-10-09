const API_BASE = '/api/v1';

async function handleResponse(res) {
  if (!res.ok) {
    const errText = await res.text();
    let errMessage = `HTTP error ${res.status}`;
    try {
      const parsed = JSON.parse(errText);
      errMessage = parsed.message || parsed.error || errMessage;
    } catch {
      errMessage = errText || errMessage;
    }
    throw new Error(errMessage);
  }
  const json = await res.json();
  return json.data;
}

export const api = {
  // KPIs
  async getKpiSummary() {
    const res = await fetch(`${API_BASE}/kpi/summary`);
    return handleResponse(res);
  },

  async getKpiTrends(days = 14) {
    const res = await fetch(`${API_BASE}/kpi/trends?days=${days}`);
    return handleResponse(res);
  },

  // Warehouse & Yard
  async getWarehouseZones() {
    const res = await fetch(`${API_BASE}/warehouse-zones`);
    return handleResponse(res);
  },

  // Shipments & Manifest
  async getShipments({ channel = '', stage = '', corridor = '', search = '', page = 0, size = 20 } = {}) {
    const params = new URLSearchParams();
    if (channel) params.append('channel', channel);
    if (stage) params.append('stage', stage);
    if (corridor) params.append('corridor', corridor);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('size', size);
    const res = await fetch(`${API_BASE}/shipments?${params.toString()}`);
    return handleResponse(res);
  },

  async getShipmentChannelBreakdown() {
    const res = await fetch(`${API_BASE}/shipments/channels/breakdown`);
    return handleResponse(res);
  },

  // Fleet & Corridor Logistics
  async getFleetTrips({ corridor = '', status = '' } = {}) {
    const params = new URLSearchParams();
    if (corridor) params.append('corridor', corridor);
    if (status) params.append('status', status);
    const res = await fetch(`${API_BASE}/fleet/trips?${params.toString()}`);
    return handleResponse(res);
  },

  async getFleetStats() {
    const res = await fetch(`${API_BASE}/fleet/stats`);
    return handleResponse(res);
  },

  // Bottleneck Alerts
  async getBottleneckAlerts(status = '') {
    const url = status ? `${API_BASE}/bottlenecks?status=${status}` : `${API_BASE}/bottlenecks/active`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async resolveBottleneck(id) {
    const res = await fetch(`${API_BASE}/bottlenecks/${id}/resolve`, {
      method: 'PATCH',
    });
    return handleResponse(res);
  },

  // Executive Briefings
  async getLatestBriefing() {
    const res = await fetch(`${API_BASE}/briefings/latest`);
    return handleResponse(res);
  },

  async generateBriefing(date, customFocus = '') {
    const res = await fetch(`${API_BASE}/briefings/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, customFocus }),
    });
    return handleResponse(res);
  },

  // Ask Synapse AI
  async askSynapse(query, contextFilter = 'GENERAL') {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, contextFilter }),
    });
    return handleResponse(res);
  },
};

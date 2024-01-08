// response type by https://betterstack.com/docs/uptime/api/status-pages-api-response-params/
export interface StatusPageResponse {
  id: string
  type: 'status_page'
  attributes: {
    company_name: string
    company_url: string
    contact_url: string
    logo_url: string
    timezone: string
    subdomain: string
    custom_domain: string
    custom_css: string
    google_analytics_id: string
    min_incident_length: number
    announcement: string
    announcement_embed_enabled: boolean
    announcement_embed_css: string
    announcement_embed_link: string
    subscribable: boolean
    hide_from_search_engines: boolean
    password_enabled: boolean
    history: number
    aggregate_state: 'operational' | 'downtime' | 'degraded'
    created_at: string
    updated_at: string
  }
}

export interface StatusResourceResponse {
  id: string
  type: 'status_page_resource'
  attributes: {
    status_page_section_id: number
    resource_id: number
    resource_type: 'monitor' | 'Heartbeat' | 'WebhookIntegration' | 'EmailIntegration'
    widget_type: 'plain' | 'history' | 'response_times'
    public_name: string
    explanation: string
    position: number
    availability: number
    status_history: Array<{
      day: string
      status: 'operational' | 'downtime' | 'degraded'
      downtime_duration: number
      maintenance_duration: number
    }>
  }
}

export interface StatusSection {
  id: string
  type: 'status_page_section'
  attributes: {
    status_page_id: number
    name: string
    position: number
  }
}

export interface StatusIncident {
  id: string,
  type: 'incident'
  attributes: {
    name: string,
    url: string
    http_method: string
    cause: string
    incident_group_id: null
    started_at: Date
    acknowledged_at: null
    acknowledged_by: null
    resolved_at: null
    resolved_by: null
    response_content: string
    response_options: string
    regions: string[]
    response_url: null
    screenshot_url: null
    origin_url: null
    escalation_policy_id: null
    call: boolean
    sms: boolean
    email: boolean
    push: boolean
  }
  relationships: {
    monitor: {
      data: {
        id: string
        type: 'monitor'
      }
    } 
  }
}

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Rigour Labs - Deterministic Quality Gates for AI Agents'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0d3320 0%, transparent 50%)',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 80px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span
              style={{
                color: '#22c55e',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Developer First • Local Only
            </span>
          </div>

          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#18181b',
                border: '2px solid #27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '32px', color: '#22c55e', fontWeight: 900 }}>R</span>
            </div>
            <span
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#fafafa',
                letterSpacing: '-0.02em',
              }}
            >
              RIGOUR<span style={{ color: '#22c55e' }}>LABS</span>
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#fafafa',
              textAlign: 'center',
              lineHeight: 1.2,
              margin: 0,
              marginBottom: '16px',
            }}
          >
            Deterministic Quality Gates
          </h1>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#22c55e',
              textAlign: 'center',
              lineHeight: 1.2,
              margin: 0,
              marginBottom: '32px',
            }}
          >
            for AI Agents
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '24px',
              color: '#a1a1aa',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Stop AI chaos. Enforce engineering standards locally with zero telemetry.
          </p>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: '48px',
            }}
          >
            {['MCP Native', 'Zero Telemetry', 'Sub-second Analysis'].map((feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                  }}
                />
                <span style={{ color: '#d4d4d8', fontSize: '16px', fontWeight: 600 }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#71717a', fontSize: '18px', fontWeight: 600 }}>
            rigour.run
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

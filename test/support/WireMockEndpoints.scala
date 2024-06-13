/*
 * Copyright 2023 HM Revenue & Customs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package support

import java.net.ServerSocket

import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.client.WireMock.{aResponse, post}
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.*
import org.scalatest.{BeforeAndAfterAll, BeforeAndAfterEach, Suite}
import scala.util.Try

trait WireMockEndpoints extends Suite with BeforeAndAfterAll with BeforeAndAfterEach {

  val host: String = "localhost"

  val endpointPort: Int              = PortTester.findPort()
  val endpointMock                   = new WireMock(host, endpointPort)
  val endpointMockUrl                = s"http://$host:$endpointPort"
  val endpointServer: WireMockServer = new WireMockServer(wireMockConfig().port(endpointPort))

  override def beforeEach(): Unit = {
    super.beforeEach()
    endpointMock.resetMappings()
    endpointMock.resetScenarios()
    endpointMock.register(
      post("/write/audit")
        .willReturn(aResponse().withStatus(204))
    );
  }
  override def afterAll(): Unit  =
    endpointServer.stop()
  override def beforeAll(): Unit =
    endpointServer.start()
}

object PortTester {

  def findPort(excluded: Int*): Int =
    (6002 to 7000).find(port => !excluded.contains(port) && isFree(port)).getOrElse(throw new Exception("No free port"))

  private def isFree(port: Int): Boolean = {
    val triedSocket = Try {
      val serverSocket = new ServerSocket(port)
      Try(serverSocket.close())
      serverSocket
    }
    triedSocket.isSuccess
  }
}
